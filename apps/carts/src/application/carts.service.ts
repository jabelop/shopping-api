
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartsRepository } from '../../../../libs/shared/src/domain/cart/carts.repository';
import Cart from '../domain/cart';
import Product from '../../../../libs/shared/src/domain/product/product';

@Injectable()
export class CartsService {
  constructor(
    @Inject(CartsRepository) private readonly cartsRepository: CartsRepository
  ) { }


  /**
   * create a cart
   * 
   * @param cart the cart to save
   * 
   * @returns a Promise with true if the cart was created, false it there was an error
   */
  async createCart(cartId: string, userId: string): Promise<boolean> {
    const cartModel: Cart = Cart.createCart(cartId, userId);
    const result: boolean = await this.cartsRepository.createCart(cartModel);
    return result;
  }

  /**
   * get a cart
   * 
   * @param id the id to look for
   * 
   * @returns a Promise with the cart if was found, null if not
   */
  async getCart(id: string): Promise <Cart> {
    return await this.cartsRepository.getCart(id);
  }

  /**
     * add a product given its id to a cart given its id
     * 
     * @param idCart the id of the cart
     * @param idProduct theid  of the product to add
     * 
     * @returns a Promise with true if the product was added, false if was not
     */
  async addProductToCart(idCart: string, product: Product): Promise<boolean> {
    const cart: Cart = await this.cartsRepository.getCart(idCart);

    if (!cart) throw new NotFoundException("Cart does not exist");

    const cartModel: Cart = Cart.getCartFromDTO(cart);
    cart.products.push(product);
    this.cartsRepository.saveCart(cart);
    return true;

  }

  /**
   * remove a product given its id from a cart given its id
   * 
   * @param idCart the id of the cart
   * @param idProduct theid  of the product to remove
   * 
   * @returns a Promise with true if the product was removed, false if was not
   */
  async removeProductFromCart(idCart: string, product: Product): Promise<boolean> {
    const cart: Cart = await this.cartsRepository.getCart(idCart);

    if (!cart) throw new NotFoundException("Cart does not exist");

    const cartModel: Cart = Cart.getCartFromDTO(cart);
    const productIndex: number = cartModel.products.findIndex((addProduct: Product) => product.id === addProduct.id);
    if (productIndex < 0) throw new NotFoundException("Product is not present on the cart");
    cartModel.products.splice(productIndex, 1);
    this.cartsRepository.saveCart(cart);
    return true;

  };
}
