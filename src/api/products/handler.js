class ProductsHandler {
  constructor(service, logActivityService, validator) {
    this._service = service;
    this._logActivityService = logActivityService;
    this._validator = validator;

    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductsByIdHandler = this.getProductsByIdHandler.bind(this);
    this.putProductsByIdHandler = this.putProductsByIdHandler.bind(this);
    this.putStatusProductsByIdHandler = this.putStatusProductsByIdHandler.bind(this);
  }

  async postProductHandler(request, h) {
    await this._validator.validatePostProductPayload(request.payload);

    const {id: credentialUserId} = request.auth.credentials;
    const {name, price, typeProduct} = request.payload;

    const resultProductId = await this._service.addProduct({credentialUserId, name, price, typeProduct});

    await this._logActivityService.postLogActivity({credentialUserId, activity: 'menambahkan product', refersId: resultProductId});

    return {
      status: 'success',
      message: 'Berhasil menambahkan product',
    };
  }

  async getProductsHandler() {
    const products = await this._service.getProducts();

    return {
      status: 'success',
      data: {
        products,
      },
    };
  }

  async getProductsByIdHandler(request) {
    const {id: productId} = request.params;

    const product = await this._service.getProductsById(productId);

    return {
      status: 'success',
      data: {
        product,
      },
    };
  }

  async putProductsByIdHandler(request) {
    await this._validator.validatePutProductPayload(request.payload);

    const {id: credentialUserId} = request.auth.credentials;
    const {productId, name, price, typeProduct} = request.payload;

    await this._service.editProductsById({credentialUserId, productId, name, price, typeProduct});

    await this._logActivityService.postLogActivity({credentialUserId, activity: 'update data product', refersId: productId});

    return {
      status: 'success',
      message: 'Berhasil update data product',
    };
  }

  async putStatusProductsByIdHandler(request) {
    await this._validator.validatePutStatusProductPayload(request.payload);

    const {id: credentialUserId} = request.auth.credentials;
    const {productId, status} = request.payload;

    await this._service.editStatusProductsById({credentialUserId, productId, status});

    await this._logActivityService.postLogActivity({credentialUserId, activity: 'update status product', refersId: productId});

    return {
      status: 'success',
      message: 'Berhasil update status product',
    };
  }
}

module.exports = ProductsHandler;
