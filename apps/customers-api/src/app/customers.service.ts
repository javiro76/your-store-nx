import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CustomersService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Crear un nuevo customer
  async createCustomer(data: {
    email: string;
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  }) {
    return this.customer.create({
      data,
    });
  }

  // Obtener todos los customers
  async getAllCustomers() {
    return this.customer.findMany({
      include: {
        orders: true, // Incluir órdenes relacionadas
      },
    });
  }

  // Obtener customer por ID
  async getCustomerById(id: string) {
    return this.customer.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });
  }

  // Obtener customer por email
  async getCustomerByEmail(email: string) {
    return this.customer.findUnique({
      where: { email },
      include: {
        orders: true,
      },
    });
  }

  // Actualizar customer
  async updateCustomer(id: string, data: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  }) {
    return this.customer.update({
      where: { id },
      data,
    });
  }

  // Eliminar customer
  async deleteCustomer(id: string) {
    return this.customer.delete({
      where: { id },
    });
  }

  // Crear una orden para un customer
  async createOrder(data: {
    orderNumber: string;
    customerId: string;
    total: number;
    status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  }) {
    return this.order.create({
      data,
      include: {
        customer: true,
      },
    });
  }
}
