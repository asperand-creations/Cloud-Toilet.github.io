const toiletList = document.querySelector('#toilet-list');
const form = document.querySelector('#add-toilet-form');

//create element and render toilet
function renderToilet(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    toiletList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('toilets').doc(id).delete();
    });
}

//getting data
// db.collection('toilets').where('city', '==', 'Chennai').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderToilet(doc);       
//     })
// });

//saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('toilets').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});
         
//real-time listener
db.collection('toilets').orderBy('name').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderToilet(change.doc);
        } else if (change.type == 'removed'){
            let li = toiletList.querySelector('[data-id=' + change.doc.id + ']');
            toiletList.removeChild(li);
        }
    })
})