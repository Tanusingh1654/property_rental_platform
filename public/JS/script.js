(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

 
  let navbar=document.getElementsByClassName("navbar");
  let toggler=document.getElementsByClassName("navbar-toggler");
 let active=false;
  toggler.addEventListener("click",()=>{
    if(!active){
      navbar.style.height="10rem";
      active=true;
    }else{
      navbar.style.height="5rem";
      active=false;
    }
  })