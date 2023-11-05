class APIFeatures {
  constructor(query, queryStrFromRoute) {
    this.query = query;
    this.queryStrFromRoute = queryStrFromRoute;
  }

  filter() {
    //1A) BUILD A QUERY
    const queryObj = { ...this.queryStrFromRoute };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    //2) Sorting
    if (this.queryStrFromRoute.sort) {
      const sortBy = this.queryStrFromRoute.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitField() {
    if (this.queryStrFromRoute.fields) {
      const field = this.queryStrFromRoute.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryStrFromRoute.page * 1 || 1;
    const limit = this.queryStrFromRoute.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
