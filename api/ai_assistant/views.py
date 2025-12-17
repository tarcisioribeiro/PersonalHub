from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import QuerySerializer, QueryResponseSerializer
from .rag_service import get_rag_service
from app.permissions import GlobalDefaultPermission
from security.activity_logs.models import ActivityLog


class AIQueryView(APIView):
    """
    AI Assistant query endpoint.

    POST /api/v1/ai/query/

    Accepts natural language questions and returns AI-generated answers
    based on the user's personal data across all modules.

    The assistant semantically searches across:
    - Finance: Expenses, revenues, accounts
    - Security: Passwords, secure files
    - Library: Books, summaries, readings

    And returns a contextualized AI-generated response.
    """
    permission_classes = [IsAuthenticated, GlobalDefaultPermission]

    def post(self, request):
        """Process AI Assistant query."""
        serializer = QuerySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        question = serializer.validated_data['question']
        top_k = serializer.validated_data.get('top_k', 5)

        try:
            # Get user's member
            member = request.user.member

            # Get RAG service and process query
            rag_service = get_rag_service()
            result = rag_service.query(question, member, top_k=top_k)

            # Log activity
            ActivityLog.log_action(
                user=request.user,
                action='query',
                app_name='ai_assistant',
                description=f"Consulta AI: {question[:100]}...",
                ip_address=request.META.get('REMOTE_ADDR')
            )

            response_serializer = QueryResponseSerializer(result)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Log error
            ActivityLog.log_action(
                user=request.user,
                action='query_error',
                app_name='ai_assistant',
                description=f"Erro na consulta AI: {str(e)}",
                ip_address=request.META.get('REMOTE_ADDR')
            )

            return Response(
                {'error': 'Erro ao processar consulta', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
