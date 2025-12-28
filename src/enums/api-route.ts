export enum ApiRoute {
  Offers = '/offers',
  Offer = 'offers/:id',
  NearbyOffers = 'offers/:id/nearby',
  Comments = '/comments/:id',
  Login = '/login',
  Logout = '/logout',
  FavoriteStatus = '/favorite/:offerId/:status',
  Favorite = '/favorite'
}
