from django.urls import path
from . import views


urlpatterns = [
    path(
        'credit-cards/',
        views.CreditCardCreateListView.as_view(),
        name='credit_card-create-list'
    ),
    path(
        'credit-cards/<int:pk>/',
        views.CreditCardRetrieveUpdateDestroyView.as_view(),
        name='credit-card-detail-view'
    ),
    path(
        'credit-cards-bills/',
        views.CreditCardBillCreateListView.as_view(),
        name='credit_card-bill-create-list'
    ),
    path(
        'credit-cards-bills/<int:pk>/',
        views.CreditCardBillRetrieveUpdateDestroyView.as_view(),
        name='credit-card-bill-detail-view'
    ),
    path(
        'credit-cards-expenses/',
        views.CreditCardExpenseCreateListView.as_view(),
        name='credit_card-expense-create-list'
    ),
    path(
        'credit-cards-expenses/<int:pk>/',
        views.CreditCardExpenseRetrieveUpdateDestroyView.as_view(),
        name='credit-card-expense-detail-view'
    ),
]
