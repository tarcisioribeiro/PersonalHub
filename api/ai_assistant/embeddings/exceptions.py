"""
Embedding Service Exceptions

Custom exceptions for the embedding generation pipeline.
"""


class EmbeddingError(Exception):
    """Base exception for embedding-related errors."""
    pass


class EmbeddingGenerationError(EmbeddingError):
    """Raised when embedding generation fails."""

    def __init__(self, text_preview: str, original_error: Exception = None):
        self.text_preview = text_preview[:100] if text_preview else ""
        self.original_error = original_error
        message = f"Failed to generate embedding for text: '{self.text_preview}...'"
        if original_error:
            message += f" Error: {str(original_error)}"
        super().__init__(message)


class EmbeddingBatchError(EmbeddingError):
    """Raised when batch embedding generation fails."""

    def __init__(self, batch_size: int, failed_count: int, original_error: Exception = None):
        self.batch_size = batch_size
        self.failed_count = failed_count
        self.original_error = original_error
        message = f"Batch embedding failed: {failed_count}/{batch_size} texts failed"
        if original_error:
            message += f". Error: {str(original_error)}"
        super().__init__(message)
