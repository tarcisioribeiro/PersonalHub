from django.urls import path
from . import views


urlpatterns = [
    path(
        'expenses/',
        views.ExpenseCreateListView.as_view(),
        name="expense-create-list"
    ),
    path(
        'expenses/<int:pk>/',
        views.ExpenseRetrieveUpdateDestroyView.as_view(),
        name='expense-detail-view'
    ),
]
