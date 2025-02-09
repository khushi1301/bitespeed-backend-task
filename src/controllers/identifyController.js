const { Op } = require("sequelize");
const { Contact } = require("../models");

const identifyContact = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "Email or PhoneNumber required" });
    }

    const existingContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    let primaryContact = null;
    let secondaryContacts = [];

    if (existingContacts.length > 0) {
      primaryContact =
        existingContacts.find((c) => c.linkPrecedence === "primary") ||
        existingContacts[0];

      secondaryContacts = existingContacts.filter(
        (c) => c.id !== primaryContact.id
      );
    }

    if (!primaryContact) {
      primaryContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });
    } else {
      const existingEmails = new Set(
        existingContacts.map((c) => c.email).filter(Boolean)
      );
      const existingPhoneNumbers = new Set(
        existingContacts.map((c) => c.phoneNumber).filter(Boolean)
      );

      if (
        (email && !existingEmails.has(email)) ||
        (phoneNumber && !existingPhoneNumbers.has(phoneNumber))
      ) {
        const newContact = await Contact.create({
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        });

        secondaryContacts.push(newContact);
      }
    }

    const response = {
      contact: {
        primaryContactId: primaryContact.id,
        emails: [
          ...new Set(
            [
              primaryContact.email,
              ...secondaryContacts.map((c) => c.email),
            ].filter(Boolean)
          ),
        ],
        phoneNumbers: [
          ...new Set(
            [
              primaryContact.phoneNumber,
              ...secondaryContacts.map((c) => c.phoneNumber),
            ].filter(Boolean)
          ),
        ],
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { identifyContact };
