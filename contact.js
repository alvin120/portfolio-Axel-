//balise.addeventlister("event",()=>{ 

//}); 

document.addEventListener('DOMContentLoaded',()=>
    {
    const menu = document.querySelector('.menuBurgeur'); 
    console.log(menu);
    const nav = document.querySelector('nav');
    console.log(nav);
    menu.addEventListener("click",() => { 
    
       nav.classList.toggle('navOpen'); 
    
         });
    
    }); 

   