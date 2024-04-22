const express = require('express');
const router = express.Router();
const contacts = require('../../models/contacts.js');
const { addNewContact, changeContact } = require('../../joi/contact.js');

router.get('/', async (req, res, next) => {
  const allContacts = await contacts.listContacts();
  await res.json({
    status: 'success',
    code: 200,
    data: { allContacts },
  });
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    res.json({
      status: 'rejected',
      code: 404,
      message: 'Not Found',
    });
  } else {
    res.json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const validation = addNewContact.validate({ name, email, phone });
    if (validation.error) {
      res.json({
        status: 'rejected',
        code: 400,
        message: `validation error: ${validation.error.message}`,
      });
    } else {
      console.log('Data is valid!');
    }
    const newContact = await contacts.addContact(name, email, phone);
    if (!name || !email || !phone) {
      res.json({
        status: 'failed',
        code: 400,
        message: 'missing required name - field',
      });
    } else {
      res.json({
        status: 'success',
        code: 201,
        message: 'Added new contact',
        data: { newContact },
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const deleteContact = await contacts.removeContact(contactId);
  if (!deleteContact) {
    res.json({
      status: 'rejected',
      code: 404,
      message: 'Not Found',
    });
  } else {
    res.json({
      status: 'success',
      code: 200,
      message: 'Contact deleted',
    });
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const updateCurrentContact = await contacts.updateContact(contactId, body);
  if (Object.keys(req.body).length === 0) {
    res.json({
      status: 'rejected',
      code: 400,
      message: 'missing fields',
    });
  }
  const validation = changeContact.validate({ ...body });
  if (validation.error) {
    res.json({
      status: 'rejected',
      code: 400,
      message: `Validation Error: ${validation.error.message}`,
    });
  } else {
    console.log('Data is valid');
  }
  if (!updateCurrentContact) {
    res.json({
      status: 'failed',
      code: 404,
      message: 'Not Found',
    });
  }
  res.json({
    status: 'success',
    code: 200,
    message: 'Contact successfully changed!',
  });
});

module.exports = router;
