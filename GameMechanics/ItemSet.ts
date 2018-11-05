///<reference path="Item.ts"/>
class ItemSet {
    items: [Item];

    addItem(item: Item): void {
        this.items.push(item);
    }

    /**
     * Checks wether the Itemset contains an instance of the given item type.
     * @param {ItemType} type - The type of the item.
     * @return {boolean} True if the itemset contains that type, false otherwise.
     */
    containsType(type: ItemType): boolean {
        for (let item of this.items) {
            if (item.type === type) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks wether the Itemset contains an instance of the given item.
     * @param {Item} item - The item.
     * @return {boolean} True if the itemset contains that item, false otherwise.
     */
    containsItem(item: Item): boolean {
        for (let i of this.items) {
            if (i.type === item.type && i.tier === item.tier && i.duration === item.duration) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes the first instance of the given type in the itemset.
     * @param {ItemType} type - The type of the item.
     */
    remove(type: ItemType): void {
        for (let item of this.items) {
            if (item.type === type) {
                const index = this.items.indexOf(item, 0);
                this.items.splice(index, 1);
                return;
            }
        }
    }
}