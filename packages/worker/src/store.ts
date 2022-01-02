import { Store, createState, withProps } from '@ngneat/elf';

const { state, config } = createState(
  withProps({}),
);

const store = new Store({ state, name: 'main', config });

