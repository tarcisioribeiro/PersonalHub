"""
Sentence Transformers Embedding Client

Fast, local, privacy-preserving embedding generation using sentence-transformers.
This replaces Ollama and OpenAI for a simpler, faster, and cost-free solution.
"""

import logging
from typing import List, Optional
from dataclasses import dataclass

import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class EmbeddingResponse:
    """Response from embedding generation."""
    embedding: List[float]
    model: str
    dimensions: int


class SentenceTransformerClient:
    """
    Local embedding generation using sentence-transformers.

    This client uses the 'all-MiniLM-L6-v2' model which:
    - Produces 384-dimensional embeddings
    - Is 5x faster than larger models
    - Supports multilingual text (including Portuguese)
    - Runs entirely locally (no API calls)
    - Uses only ~80MB of RAM

    Attributes
    ----------
    model : SentenceTransformer
        The loaded embedding model
    model_name : str
        Name of the model being used
    dimensions : int
        Number of dimensions in embeddings (384)
    """

    DEFAULT_MODEL = 'all-MiniLM-L6-v2'
    DEFAULT_DIMENSIONS = 384

    def __init__(self, model_name: Optional[str] = None):
        """
        Initialize the sentence transformer client.

        Parameters
        ----------
        model_name : str, optional
            Model name to use (default: all-MiniLM-L6-v2)
        """
        self.model_name = model_name or self.DEFAULT_MODEL
        self.dimensions = self.DEFAULT_DIMENSIONS
        self._model = None
        self._model_loaded = False

    def _load_model(self):
        """Lazy-load the model on first use."""
        if self._model_loaded:
            return

        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading sentence-transformers model: {self.model_name}")
            self._model = SentenceTransformer(self.model_name)
            self._model_loaded = True
            logger.info(f"Model loaded successfully. Embedding dimensions: {self.dimensions}")
        except ImportError:
            raise ImportError(
                "sentence-transformers not installed. "
                "Install with: pip install sentence-transformers"
            )
        except Exception as e:
            logger.error(f"Failed to load model {self.model_name}: {e}")
            raise RuntimeError(f"Failed to load embedding model: {e}")

    def is_available(self) -> bool:
        """
        Check if the embedding client is available.

        Returns
        -------
        bool
            True if model can be loaded
        """
        try:
            import sentence_transformers
            return True
        except ImportError:
            return False

    def health_check(self) -> bool:
        """
        Perform health check.

        Returns
        -------
        bool
            True if client is healthy
        """
        return self.is_available()

    def generate_embedding(self, text: str) -> EmbeddingResponse:
        """
        Generate embedding for a single text.

        Parameters
        ----------
        text : str
            Text to embed

        Returns
        -------
        EmbeddingResponse
            Embedding response with vector and metadata

        Raises
        ------
        ValueError
            If text is empty
        RuntimeError
            If embedding generation fails
        """
        if not text or not text.strip():
            raise ValueError("Empty text provided")

        self._load_model()

        try:
            # Generate embedding (returns numpy array)
            embedding_array = self._model.encode(
                text,
                convert_to_numpy=True,
                normalize_embeddings=True,  # L2 normalization for cosine similarity
                show_progress_bar=False
            )

            # Convert to list
            embedding = embedding_array.tolist()

            return EmbeddingResponse(
                embedding=embedding,
                model=self.model_name,
                dimensions=len(embedding)
            )

        except Exception as e:
            logger.error(f"Embedding generation failed for text: {text[:100]}... Error: {e}")
            raise RuntimeError(f"Failed to generate embedding: {e}")

    def generate_embeddings_batch(
        self,
        texts: List[str],
        batch_size: int = 32
    ) -> List[EmbeddingResponse]:
        """
        Generate embeddings for multiple texts in batch.

        Parameters
        ----------
        texts : List[str]
            List of texts to embed
        batch_size : int
            Batch size for processing (default: 32)

        Returns
        -------
        List[EmbeddingResponse]
            List of embedding responses

        Raises
        ------
        ValueError
            If texts list is empty
        RuntimeError
            If batch embedding generation fails
        """
        if not texts:
            raise ValueError("Empty texts list provided")

        # Filter out empty texts
        valid_texts = [t for t in texts if t and t.strip()]
        if not valid_texts:
            raise ValueError("All texts are empty")

        self._load_model()

        try:
            # Generate embeddings in batch (much faster than individual)
            embeddings_array = self._model.encode(
                valid_texts,
                batch_size=batch_size,
                convert_to_numpy=True,
                normalize_embeddings=True,
                show_progress_bar=False
            )

            # Convert to list of responses
            responses = []
            for embedding_array in embeddings_array:
                embedding = embedding_array.tolist()
                responses.append(EmbeddingResponse(
                    embedding=embedding,
                    model=self.model_name,
                    dimensions=len(embedding)
                ))

            return responses

        except Exception as e:
            logger.error(f"Batch embedding generation failed: {e}")
            raise RuntimeError(f"Failed to generate batch embeddings: {e}")

    def get_model_info(self) -> dict:
        """
        Get information about the loaded model.

        Returns
        -------
        dict
            Model information
        """
        return {
            'model_name': self.model_name,
            'dimensions': self.dimensions,
            'is_local': True,
            'is_loaded': self._model_loaded,
            'supports_multilingual': True
        }


# Singleton instance
_sentence_transformer_client: Optional[SentenceTransformerClient] = None


def get_sentence_transformer_client(
    model_name: Optional[str] = None
) -> SentenceTransformerClient:
    """
    Get the singleton SentenceTransformerClient instance.

    Parameters
    ----------
    model_name : str, optional
        Model name to use (only used on first call)

    Returns
    -------
    SentenceTransformerClient
        Configured client
    """
    global _sentence_transformer_client
    if _sentence_transformer_client is None:
        _sentence_transformer_client = SentenceTransformerClient(model_name)
    return _sentence_transformer_client
