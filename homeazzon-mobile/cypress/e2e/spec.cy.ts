describe('empty spec', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('shows tab 1', () => {
    cy.get('.tab1').click();
  });

  it('shows tab 2', () => {
    cy.get('.tab2').click();
  });

  it('shows tab 3', () => {
    cy.get('.tab3').click();
  });

  it('goes back to tab 1', () => {
    cy.get('.tab1').click();
    cy.get('.welcome-image');
    cy.get('.welcome-text');
    cy.get('.get-started');
  });
})

// https://devdactic.com/ionic-e2e-tests-cypress/
