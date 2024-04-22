const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, { encoding: 'utf8' });
  const contactsList = await JSON.parse(data);
  console.log(contactsList);
  return contactsList;
};

const getContactById = async contactId => {
  const data = await fs.readFile(contactsPath, { encoding: 'utf8' });
  const contactList = await JSON.parse(data);
  const contact = contactList.find(item => item.id === contactId);
  return contact;
};

const removeContact = async contactId => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf8' });
    const contactList = await JSON.parse(data);
    const newList = contactList.filter(item => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));
    return newList;
  } catch (error) {
    console.error('Error:', error);
  }
};

const addContact = async (name, email, phone) => {
  const contactsList = await listContacts();
  console.log(contactsList);
  const contactId = uuidv4();
  const contact = { id: contactId, name, email, phone };
  contactsList.push(contact);
  fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return contactsList;
};

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const id = contactId;
  const contactIndex = contactsList.findIndex(contact => contact.id === id);
  if (contactIndex === -1) {
    console.log(`Contact doesn't exist`);
  } else {
    const updatedContacts = contactsList.map(contact => {
      if (contact.id === id) {
        return { ...contact, ...body };
      }
      return contact;
    });
    contactsList[contactIndex] = { id, ...body };
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return updatedContacts[contactIndex];
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
