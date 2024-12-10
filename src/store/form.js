import { atom, map } from 'nanostores';

export const activeDreamUpCard = atom(0);

export const formItems = map({});

export function addFormItem({ name, ...formData }) {
    const existingEntry = formItems.get()[name];
    if (existingEntry) {
        formItems.setKey(name, {
        ...existingEntry,
        ...formData,
      })
    } else {
        formItems.setKey(
        name,
        { ...formData }
      );
    }
  }