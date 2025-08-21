import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {

  constructor(private readonly prisma: PrismaService) { }


  async create(createProductDto: CreateProductDto) {
    // Si no se proporciona categoryId, usar la categoría "General" por defecto
    let categoryId = createProductDto.categoryId;
    
    if (!categoryId) {
      // Buscar la categoría "General" o crear una si no existe
      let generalCategory = await this.prisma.category.findUnique({
        where: { name: 'General' }
      });
      
      if (!generalCategory) {
        generalCategory = await this.prisma.category.create({
          data: { name: 'General' }
        });
      }
      
      categoryId = generalCategory.id;
    } else {
      // Verificar que la categoría existe
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: categoryId }
      });
      
      if (!categoryExists) {
        throw new Error(`Category with id ${categoryId} does not exist`);
      }
    }
    
    const uploadProduct = { ...createProductDto, categoryId };
    
    return await this.prisma.product.create({
      data: uploadProduct,
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto
    });
  }


  async remove(id: string) {
    return await this.prisma.product.delete({
      where: {
        id
      }
    });
  }

  // Método para obtener todas las categorías
  async findAllCategories() {
    return await this.prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }

  // Método para crear una nueva categoría
  async createCategory(name: string) {
    return await this.prisma.category.create({
      data: { name }
    });
  }
}
