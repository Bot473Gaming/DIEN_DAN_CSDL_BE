import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      console.log('Login attempt with username:', signInDto.username);

      const user = await this.userService.findByUsername(signInDto.username);
      console.log('User found:', user ? 'yes' : 'no');

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('Comparing passwords...');
      const isPasswordValid = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      console.log('Password valid:', isPasswordValid ? 'yes' : 'no');

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);
      console.log('Token generated successfully');

      return {
        access_token: token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during login');
    }
  }
}
