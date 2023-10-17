// Tüm li bağlantılarını seçin
const menuLink = document.querySelector('a[href="#menus"]');
const aboutLink = document.querySelector('a[href="#about"]');


// Bağlantılara tıklandığında ilgili bölümlere kaydırmayı gerçekleştirin
menuLink.addEventListener('click', scrollToSection);
aboutLink.addEventListener('click', scrollToSection);

function scrollToSection(event) {
  event.preventDefault(); // Bağlantıya tıklamayı engelleyin
  const targetId = event.target.getAttribute('href').substring(1); // Hedef bölümün ID'sini alın (başındaki "#" işaretini kaldırın)
  const targetSection = document.getElementById(targetId); // Hedef bölümü seçin
  if (targetSection) {
    // Hedef bölüm varsa aşağı kaydırma işlemini gerçekleştirin
    targetSection.scrollIntoView({ behavior: 'smooth' });
  }
}
