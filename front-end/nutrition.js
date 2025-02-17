//All tab links and content sections
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

//Hide all content sections
function hideAllContent() {
    tabContents.forEach((content) => {
        content.classList.remove('active');
    });
}

//Show the clicked tab content
function showTabContent(target) {
    const contentToShow = document.getElementById(target);
    contentToShow.classList.add('active');
}

//Add event listeners to each tab link
tabLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); 

        const targetTab = event.target.getAttribute('data-target');
        
        console.log('Tab clicked:', targetTab);
        //Hide all content and then show the selected one
        hideAllContent();
        showTabContent(targetTab);

        //Add active class to the clicked link to highlight it
        tabLinks.forEach((link) => link.classList.remove('active')); 
        event.target.classList.add('active'); 
    });
});

//Show the home tab content initially
showTabContent('home');
document.querySelector('.tab-link[data-target="home"]').classList.add('active');
