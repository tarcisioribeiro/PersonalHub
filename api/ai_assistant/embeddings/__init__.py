"""
Embeddings Module

This module provides embedding generation services using sentence-transformers.
All embeddings are generated locally to ensure no API calls are needed.

Main components:
- SentenceTransformerClient: Local embedding generation using sentence-transformers
- EmbeddingService: Centralized embedding generation
- EmbeddingIndexer: Background indexing of content
"""

from .service import EmbeddingService, get_embedding_service, EmbeddingResult
from .sentence_transformer_client import (
    SentenceTransformerClient,
    get_sentence_transformer_client
)
from .exceptions import (
    EmbeddingError,
    EmbeddingGenerationError
)

__all__ = [
    'EmbeddingService',
    'get_embedding_service',
    'EmbeddingResult',
    'SentenceTransformerClient',
    'get_sentence_transformer_client',
    'EmbeddingError',
    'EmbeddingGenerationError',
]
