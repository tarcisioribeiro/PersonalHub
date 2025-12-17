from django.urls import path
from library.views import (
    # Author views
    AuthorListCreateView,
    AuthorDetailView,
    # Publisher views
    PublisherListCreateView,
    PublisherDetailView,
    # Book views
    BookListCreateView,
    BookDetailView,
    # Summary views
    SummaryListCreateView,
    SummaryDetailView,
    # Reading views
    ReadingListCreateView,
    ReadingDetailView,
)

urlpatterns = [
    # Authors
    path('authors/', AuthorListCreateView.as_view(), name='author-list-create'),
    path('authors/<int:pk>/', AuthorDetailView.as_view(), name='author-detail'),
    
    # Publishers
    path('publishers/', PublisherListCreateView.as_view(), name='publisher-list-create'),
    path('publishers/<int:pk>/', PublisherDetailView.as_view(), name='publisher-detail'),
    
    # Books
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    
    # Summaries
    path('summaries/', SummaryListCreateView.as_view(), name='summary-list-create'),
    path('summaries/<int:pk>/', SummaryDetailView.as_view(), name='summary-detail'),
    
    # Readings
    path('readings/', ReadingListCreateView.as_view(), name='reading-list-create'),
    path('readings/<int:pk>/', ReadingDetailView.as_view(), name='reading-detail'),
]
