const express = require('express');
const router = express.Router();
const {authenticationMiddleware} = require('../authentication');
const {encrypt, decrypt} = require('../compress');
const {rootpath} = require('../rootpath');
const path = require('path');
const fs = require('fs');

router.get('/', authenticationMiddleware(), (req, res) => {
    res.render('Journals',{title: "Journals", username: req.session.passport.user.username});
});

router.get('/addnew', authenticationMiddleware(), (req, res) => {
    res.render('addnew', {title: "Add Journal", username: req.session.passport.user.username});
});

router.get('/viewall', authenticationMiddleware(), (req,res) => {
    res.render('viewall', {title: "View All", username: req.session.passport.user.username})
})

router.post('/viewall', authenticationMiddleware(), async (req, res) => {
    let username = req.session.passport.user.username;
    try {
        let detailspath = path.join(rootpath, 'data');
        let details = fs.readFileSync(`${detailspath}\\data.json`);
        let detailsParsed = JSON.parse(details);
        // let fetchedData = [];
        
        // async function fetchElem(detailsParsed) {
        //    await detailsParsed.forEach((elem, i) => {
        //         if(elem.user === username) {
        //             elem.content = decrypt(elem[i].content)
        //             fetchedData.push(elem);
        //         }
        //     });
        //     return fetchedData;
        // }
        // fetchedData1 = fetchElem(detailsParsed);
        // console.log('fetchedData')
        // if(fetched === detailsParsed.length)
            // console.log(fetchedData)
        res.send({title: "View All", datas: detailsParsed, username});
    }
    catch(e) {
        res.render('error',{username: req.session.passport.user.username});
    }
});

router.post('/addnew', authenticationMiddleware(), (req, res) => {
    let encContent = encrypt(req.body.content);

    let newData = {
        user: req.session.passport.user.username,
        content: encContent,
        dateCreated: (new Date()).toDateString()
    }

    let detailspath = path.join(rootpath, 'data');
    let details = fs.readFileSync(`${detailspath}\\data.json`);
    let detailsParsed = JSON.parse(details);

    detailsParsed.push(newData);

    fs.writeFile(`${detailspath}/data.json`,JSON.stringify(detailsParsed),(err) => {
        if(err) res.send({msg:"danger",msg1:"Error adding journal."});
        else res.send({msg:"success",msg1:"Journal added successfully."});
    });
})

module.exports = router;