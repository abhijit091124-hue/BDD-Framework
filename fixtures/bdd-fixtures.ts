import { test as playwrightTest } from 'playwright-bdd';
import { InventoryPage } from '../pages/InventoryPage';

type BddFixtures = {
  inventoryPage: InventoryPage;
};

export const test = playwrightTest.extend<BddFixtures>({
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});
