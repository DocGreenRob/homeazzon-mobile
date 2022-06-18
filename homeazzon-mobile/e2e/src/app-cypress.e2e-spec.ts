describe('Web App Testing', () => {
 
    it('shows the landing page', () => {
        cy.visit('/');
        cy.contains('Welcome to our shop!');
    });
 
    it('shows the about page', () => {
        cy.visit('/about');
        cy.contains('Lorem ipsum dolor sit amet');
    });
 
    it('shows 4 jewelery products', () => {
        cy.visit('/products?category=jewelery');
        cy.get('ion-card').should('have.length', '4');
    });
});
