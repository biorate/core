import { container } from '@biorate/inversion';
import { Root } from './root';

container.get<Root>(Root).$run().catch(console.error);
