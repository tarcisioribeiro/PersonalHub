from rest_framework import serializers
from library.models import Author, Publisher, Book, Summary, Reading


# ============================================================================
# AUTHOR SERIALIZERS
# ============================================================================

class AuthorSerializer(serializers.ModelSerializer):
    """Serializer para visualização de autores."""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    nationality_display = serializers.CharField(source='get_nationality_display', read_only=True)
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = [
            'id', 'uuid', 'name', 'birthday', 'death_date',
            'nationality', 'nationality_display', 'biography',
            'books_count', 'owner', 'owner_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['uuid', 'created_at', 'updated_at']
    
    def get_books_count(self, obj):
        return obj.books.filter(deleted_at__isnull=True).count()


class AuthorCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação/atualização de autores."""
    class Meta:
        model = Author
        fields = [
            'id', 'name', 'birthday', 'death_date',
            'nationality', 'biography', 'owner'
        ]


# ============================================================================
# PUBLISHER SERIALIZERS
# ============================================================================

class PublisherSerializer(serializers.ModelSerializer):
    """Serializer para visualização de editoras."""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    country_display = serializers.CharField(source='get_country_display', read_only=True)
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Publisher
        fields = [
            'id', 'uuid', 'name', 'description', 'website',
            'country', 'country_display', 'founded_year',
            'books_count', 'owner', 'owner_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['uuid', 'created_at', 'updated_at']
    
    def get_books_count(self, obj):
        return obj.books.filter(deleted_at__isnull=True).count()


class PublisherCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação/atualização de editoras."""
    class Meta:
        model = Publisher
        fields = [
            'id', 'name', 'description', 'website',
            'country', 'founded_year', 'owner'
        ]


# ============================================================================
# BOOK SERIALIZERS
# ============================================================================

class BookSerializer(serializers.ModelSerializer):
    """Serializer para visualização de livros."""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    genre_display = serializers.CharField(source='get_genre_display', read_only=True)
    literarytype_display = serializers.CharField(source='get_literarytype_display', read_only=True)
    media_type_display = serializers.CharField(source='get_media_type_display', read_only=True)
    read_status_display = serializers.CharField(source='get_read_status_display', read_only=True)
    
    authors_names = serializers.SerializerMethodField()
    publisher_name = serializers.CharField(source='publisher.name', read_only=True)
    has_summary = serializers.SerializerMethodField()
    total_pages_read = serializers.SerializerMethodField()
    reading_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'uuid', 'title', 'authors_names', 'pages',
            'publisher', 'publisher_name', 'language', 'language_display',
            'genre', 'genre_display', 'literarytype', 'literarytype_display',
            'publish_date', 'synopsis', 'edition', 'media_type',
            'media_type_display', 'rating', 'read_status', 'read_status_display',
            'has_summary', 'total_pages_read', 'reading_progress',
            'owner', 'owner_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['uuid', 'created_at', 'updated_at']
    
    def get_authors_names(self, obj):
        return [author.name for author in obj.authors.all()]
    
    def get_has_summary(self, obj):
        return hasattr(obj, 'summary')
    
    def get_total_pages_read(self, obj):
        total = sum(r.pages_read for r in obj.readings.filter(deleted_at__isnull=True))
        return total
    
    def get_reading_progress(self, obj):
        if obj.pages > 0:
            total_read = self.get_total_pages_read(obj)
            return round((total_read / obj.pages) * 100, 1)
        return 0.0


class BookCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação/atualização de livros."""
    authors = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Author.objects.filter(deleted_at__isnull=True)
    )
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'authors', 'pages', 'publisher',
            'language', 'genre', 'literarytype', 'publish_date',
            'synopsis', 'edition', 'media_type', 'rating',
            'read_status', 'owner'
        ]


# ============================================================================
# SUMMARY SERIALIZERS
# ============================================================================

class SummarySerializer(serializers.ModelSerializer):
    """Serializer para visualização de resumos."""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = Summary
        fields = [
            'id', 'uuid', 'title', 'book', 'book_title',
            'text', 'is_vectorized', 'vectorization_date',
            'owner', 'owner_name', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'uuid', 'is_vectorized', 'vectorization_date',
            'created_at', 'updated_at'
        ]


class SummaryCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação/atualização de resumos."""
    class Meta:
        model = Summary
        fields = ['id', 'title', 'book', 'text', 'owner']


# ============================================================================
# READING SERIALIZERS
# ============================================================================

class ReadingSerializer(serializers.ModelSerializer):
    """Serializer para visualização de leituras."""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = Reading
        fields = [
            'id', 'uuid', 'book', 'book_title', 'reading_date',
            'reading_time', 'pages_read', 'notes',
            'owner', 'owner_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['uuid', 'created_at', 'updated_at']


class ReadingCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação/atualização de leituras."""
    class Meta:
        model = Reading
        fields = [
            'id', 'book', 'reading_date', 'reading_time',
            'pages_read', 'notes', 'owner'
        ]
    
    def validate(self, data):
        """Validação customizada para páginas lidas."""
        instance = self.instance
        if instance:
            # Cria uma instância temporária para validação
            temp_instance = Reading(**data)
            temp_instance.pk = instance.pk
        else:
            temp_instance = Reading(**data)
        
        temp_instance.clean()  # Chama o método clean() do model
        return data
