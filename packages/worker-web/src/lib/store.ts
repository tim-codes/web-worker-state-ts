import { Store, createState, withProps } from '@ngneat/elf';

export interface StoreProps {
  count: number;
}

export default function setupStore() {
  const { state, config } = createState(
    withProps<StoreProps>({ count: 0 }),
  );

  const store = new Store({ state, name: 'main', config });

  return store;
}
