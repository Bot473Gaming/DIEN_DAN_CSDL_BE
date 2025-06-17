import { UserProfile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';

export class UpdateUserProfileDto {
  user?: Partial<Omit<User, '_id'>>;
  profile?: Partial<Omit<UserProfile, '_id'>>;
}
