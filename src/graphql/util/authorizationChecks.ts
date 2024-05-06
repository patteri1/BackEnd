import { MyContext } from '../context';

export const checkAdmin = (context: MyContext) => {
  if (context.user?.userRoleId !== 1) {
    throw new Error('Unauthorized')
  }
}

// If the user is not an admin and is trying to access a location that is not theirs, throw an error
export const checkAdminOrOwner = (context: MyContext, locationId: number) => {
  if (context.user?.userRoleId !== 1) {
    if (context.user?.locationId !== locationId) {
      throw new Error('Unauthorized')
    }
  }
}