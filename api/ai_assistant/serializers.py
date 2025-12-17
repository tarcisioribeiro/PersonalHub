from rest_framework import serializers


class QuerySerializer(serializers.Serializer):
    """Serializer for AI Assistant query requests."""
    question = serializers.CharField(
        required=True,
        help_text="Pergunta ou consulta do usuário",
        max_length=1000
    )
    top_k = serializers.IntegerField(
        required=False,
        default=5,
        min_value=1,
        max_value=10,
        help_text="Número de resultados relevantes a considerar"
    )


class SourceSerializer(serializers.Serializer):
    """Serializer for source information."""
    module = serializers.CharField()
    type = serializers.CharField()
    score = serializers.FloatField()
    metadata = serializers.DictField()


class QueryResponseSerializer(serializers.Serializer):
    """Serializer for AI Assistant query responses."""
    answer = serializers.CharField(help_text="Resposta gerada pelo AI Assistant")
    sources = SourceSerializer(many=True, help_text="Fontes utilizadas para gerar a resposta")
