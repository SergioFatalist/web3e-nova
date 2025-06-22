export default {
  addOrderedItem: <T extends { order: number }>(items: T[], item: T) => {
    if (items == undefined) return;
    const order = items.length
      ? items.reduce((acc, curr) => (curr.order > acc.order ? curr : acc)).order + 1
      : 0;
    items.push({ ...item, order });
  },

  delOrderedItem: <T extends { order: number }>(items: T[], item: T) => {
    if (items == undefined) return;
    items.splice(items.indexOf(item), 1);
  },

  stepOrderedItem: <T extends { order: number }>(items: T[], item: T, up: boolean) => {
    if (items == undefined) return;
    const index = items.indexOf(item);
    if (index < 0) return;

    const targetIndex = up ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];

    [item.order, targetItem.order] = [targetItem.order, item.order];
    items.sort((a, b) => a.order - b.order);
  },

  moveOrderedItem: <T extends { order: number }>(items: T[], item: T, newOrder: number) => {
    if (items == undefined) return;

    items
      .filter((item) => item.order >= newOrder && item !== item)
      .sort((a, b) => a.order - b.order)
      .forEach((item) => (item.order += 1));
    item.order = newOrder;
    items.sort((a, b) => a.order - b.order);
  },
};
