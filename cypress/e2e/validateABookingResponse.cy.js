describe("Verify API Heroku", () => {
  let token;
  let idBooking;
  before("create a token", () => {
    cy.api({
      method: "POST",
      url: "/auth",
      header: {
        "Content-Type": "application/json",
      },
      body: {
        username: "admin",
        password: "password123",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      token = response.body.token;
      cy.log(token);
    });
  });

  it("Creating a new booking successfully", () => {
    cy.api({
      method: "POST",
      url: "/booking",
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: {
        firstname: "Sun",
        lastname: "LEE",
        totalprice: 1200,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-05-01",
          checkout: "2024-05-07",
        },
        additionalneeds: "Lunch, Breakfast, Dinner, Spa",
      },
    }).then((response) => {
      expect(response.status).equal(200);
      idBooking = response.body.bookingid;
    });
  });

  it("check a new created booking by get all bookings", () => {
    cy.api({
      method: "GET",
      url: "/booking",
      header: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      let listRes = response.body;
      let hasIdBooking = listRes.some((id) => id.bookingid === idBooking);
      expect(response.status).equal(200);
      expect(hasIdBooking).to.be.true;
    });
  });

  it("check an existing booking information", () => {
    cy.api({
      method: "GET",
      url: `/booking/${idBooking}`,
      header: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      let bookingRes = response.body;
      expect(response.status).equal(200);
      expect(bookingRes.firstname).equal("Sun");
      expect(bookingRes.lastname).equal("LEE");
      expect(bookingRes.totalprice).equal(1200);
      expect(bookingRes.depositpaid).equal(true);
      expect(bookingRes.additionalneeds).equal("Lunch, Breakfast, Dinner, Spa");
    });
  });

  it("update a booking information", () => {
    cy.log(token);
    cy.request({
      method: "PUT",
      url: `/booking/${idBooking}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //Cookie: `token=${token}`,
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
      body: {
        firstname: "June",
        lastname: "Lee",
        totalprice: 1500,
        depositpaid: false,
        bookingdates: {
          checkin: "2024-05-01",
          checkout: "2024-05-30",
        },
        additionalneeds: "All services",
      },
    }).then((response) => {
      let bookingRes = response.body;
      expect(response.status).equal(200);
      expect(bookingRes.firstname).equal("June");
      expect(bookingRes.lastname).equal("Lee");
      expect(bookingRes.totalprice).equal(1500);
      expect(bookingRes.depositpaid).equal(false);
      expect(bookingRes.bookingdates.checkin).equal("2024-05-01");
      expect(bookingRes.bookingdates.checkout).equal("2024-05-30");
      expect(bookingRes.additionalneeds).equal("All services");
    });
  });

  it("update a partial booking", () => {
    cy.log(token);
    cy.request({
      method: "PATCH",
      url: `/booking/${idBooking}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //Cookie: `token=${token}`,
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      },
      body: {
        totalprice: 2500,
        depositpaid: true,
      },
    }).then((response) => {
      let bookingRes = response.body;
      expect(response.status).equal(200);
      expect(bookingRes.firstname).equal("June");
      expect(bookingRes.lastname).equal("Lee");
      expect(bookingRes.totalprice).equal(2500);
      expect(bookingRes.depositpaid).equal(true);
      expect(bookingRes.bookingdates.checkin).equal("2024-05-01");
      expect(bookingRes.bookingdates.checkout).equal("2024-05-30");
      expect(bookingRes.additionalneeds).equal("All services");
    });
  });

  it("delete a booking", () => {
    cy.log(token);
    cy.request({
      method: "DELETE",
      url: `/booking/${idBooking}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
    }).then((response) => {
      expect(response.status).equal(201);
      expect(response.statusText).equal("Created");
    });
  });
});
