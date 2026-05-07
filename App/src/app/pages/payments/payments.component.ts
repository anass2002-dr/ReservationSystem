import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Payment } from '../../models/models';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => this.payments = data,
      error: (err) => console.error('Error fetching payments', err)
    });
  }

  addPayment(): void {
    // Navigate or open modal
  }

  editPayment(p: Payment): void {
    // Navigate or open modal
  }

  deletePayment(id: number): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(id).subscribe({
        next: () => this.loadPayments(),
        error: (err) => console.error('Error deleting payment', err)
      });
    }
  }
}


