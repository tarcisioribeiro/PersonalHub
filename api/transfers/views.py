from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from transfers.models import Transfer
from transfers.serializers import TransferSerializer
from app.permissions import GlobalDefaultPermission


class TransferCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar transferências.

    Permite:
    - GET: Lista todas as transferências (exclui deletadas)
    - POST: Cria uma nova transferência

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de transferências não deletadas
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Transfer.objects.filter(is_deleted=False)
    serializer_class = TransferSerializer

    def perform_create(self, serializer):
        """
        Preenche automaticamente os campos de auditoria ao criar uma transferência.

        Parameters
        ----------
        serializer : TransferSerializer
            Serializer validado com os dados da transferência
        """
        serializer.save(created_by=self.request.user, updated_by=self.request.user)


class TransferRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    ViewSet para operações individuais em transferências.

    Permite:
    - GET: Recupera uma transferência específica
    - PUT/PATCH: Atualiza uma transferência existente
    - DELETE: Remove uma transferência

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de todas as transferências (exclui deletadas)
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Transfer.objects.filter(is_deleted=False)
    serializer_class = TransferSerializer

    def perform_update(self, serializer):
        """
        Preenche automaticamente o campo updated_by ao atualizar uma transferência.

        Parameters
        ----------
        serializer : TransferSerializer
            Serializer validado com os dados da transferência
        """
        serializer.save(updated_by=self.request.user)
