import Product from "./product";

export interface ProductRepository {

    /**
    * save a product
    * 
    * @param product the product to save
    * 
    * @returns a Promise with true if was saved, false if it was not
    */
    saveProduct(product: Product): Promise<boolean>;

    /**
     * get a product given its id
     * 
     * @param id the id to look for
     * 
     * @returns a Promise with the product if exists, null if does not
     */
    getProduct(id: string): Promise<Product | null>;

    /**
    * reserve a product given its id
    * 
    * @param id the id to look for
    * 
    * @returns a Promise with true if was reserved, false if was not
    */
    reserveProduct(id: string): Promise<boolean>;

    /**
    * remove a quantity of reserved products given its id, and quantity
    * 
    * @param id the id to look for
    * @param quantity the quantity to remove
    * 
    * @returns a Promise with true if was removed, false if was not
    */
    removeReservedProduct(id: string): Promise<boolean>;

}

export const ProductRepository = Symbol("ProductRepository");