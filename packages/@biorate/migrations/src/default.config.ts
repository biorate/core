import { container } from '@biorate/inversion';
import { Root } from './';

container.get<Root>(Root).$run().catch(console.error);
