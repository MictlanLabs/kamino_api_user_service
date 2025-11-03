import { User } from '../../../domain/entities/User.js';
import { Email } from '../../../domain/value-objects/Email.js';
import { Password } from '../../../domain/value-objects/Password.js';
import { UserAlreadyExistsException } from '../../../domain/exceptions/UserAlreadyExistsException.js';

export class RegisterAdminUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ email, password, firstName, lastName }) {
    const emailVO = new Email(email);
    const passwordVO = new Password(password);

    const existingUser = await this.userRepository.findByEmail(emailVO.toString());
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.passwordHasher.hash(passwordVO.toString());

    const admin = new User({
      email: emailVO.toString(),
      password: hashedPassword,
      firstName,
      lastName,
      role: 'ADMIN'
    });

    const savedAdmin = await this.userRepository.save(admin);
    return savedAdmin.toJSON();
  }
}