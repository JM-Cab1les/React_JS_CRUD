import React from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useEffect } from 'react'
import { useState } from 'react'
import { Fragment } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const CRUD = () => {
const empData = [
    {
        id: 1,
        name: 'test1',
        age: 29,
        isActive: 1
    },
    {
        id: 2,
        name: 'test2',
        age: 31,
        isActive: 1
    },
    {
        id: 3,
        name: 'test3',
        age: 22,
        isActive: 0
    }
]

const [data, setData] = useState([])

const [show, setShow] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);


const [name, setName] = useState('');
const [age, setAge] = useState('');
const [isActive, setIsActive] = useState(0);

const [editID, setEditId] = useState('')
const [editName, setEditName] = useState('');
const [editAge, setEditAge] = useState('');
const [editIsActive, setEditIsActive] = useState(0);


const handleEdit = (id) => {
    handleShow()
    axios.get(`https://localhost:7187/api/Employee/${id}`)
    .then((result) =>{
       setEditName(result.data.name);
       setEditAge(result.data.age);
       setEditIsActive(result.data.isActive);
       setEditId(id);
    }).catch((error) => {
        toast.error(error);
    })
}

const handleDelete = (id) => {

    if(window.confirm("Are you sure to delete this employee?") == true)
        axios.delete(`https://localhost:7187/api/Employee/${id}`)
        .then((result) =>{
            if(result.status === 200)
            {
                toast.success('Employee has been deleted')
                getDataEmployee();
            }
        }).catch((error) => {
            toast.error(error);
        })

}

const handleUpdate = () => {
    const url = `https://localhost:7187/api/Employee/${editID}`
    const data = {
        "id": editID,
        "name": editName,
        "age": editAge,
        "isActive" : editIsActive
    }
    axios.put(url, data)
         .then((result) => {
            handleClose()
            getDataEmployee();
            clear();
            toast.success('Employee has been updated');
         }).catch((error) => {
            toast.error(error);
         })
}


useEffect(() =>{
    // setData(empData)
    setData(getDataEmployee)   
}, [])

const getDataEmployee = () => {
    axios.get('https://localhost:7187/api/Employee')
    .then((result) =>{

        setData(result.data)
    }).catch((error) =>{
      console.log(error)
    })
}

const handleSaveEmployee = () => {

    if(!name || !age  === undefined)
    {
        alert('Please complete all fields before submitting')
        return;
    }
        const url = 'https://localhost:7187/api/Employee'
        const data = {
            "name": name,
            "age" : age,
            "isActive": isActive
        }
        axios.post(url, data)
        .then((result) => {
            getDataEmployee();
            clear();
            toast.success('Employee has been added')
        }).catch((error) =>{
            toast.error(error)
        })
}

const clear = () => {
    setName('');
    setAge('');
    setIsActive(0)
    setEditAge("");
    setEditName('');
    setEditAge("");
}

const handleActiveChange = (e) => {
    if(e.target.checked)
    {
        setIsActive(1);
    }
    else
    {
        setIsActive(0)
    }
}

const handleEditActiveChange = (e) => {
    if(e.target.checked)
    {
        setEditIsActive(1);
    }
    else
    {
        setEditIsActive(0)
    }
}


  return (

    <Fragment>
        <ToastContainer/>
        <Container>
            <Row>
                <Col>
                    <input type='text' className='form-control' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}/>
                </Col>
                <Col>
                    <input type='text' className='form-control' placeholder='Enter Age' value={age} onChange={(e) => setAge(e.target.value)} />
                </Col>
                <Col>
                    <input type='checkbox' checked={isActive === 1 ? true : false } onChange={(e) => handleActiveChange(e)} value={isActive}/>
                    <label>isActive</label>
                </Col>
                <Col>
                    <button className='btn btn-primary' onClick={() => handleSaveEmployee()}>Submit</button>
                </Col>
            </Row>
        
        </Container>


        <Table striped>
        <thead>
            <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            </tr>
        </thead>
        <tbody>
            {
                data && data.length > 0 ?
                data.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                            <td>{item.isActive}</td>
                            <td colSpan={2} >
                                <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                    </tr>
                    )
                })
                :
                'Loading...'
            }
        
        </tbody>
        </Table>

     {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}  size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>
                    <input type='text' className='form-control' placeholder='Enter Name' value={editName} onChange={(e) => setEditName(e.target.value)}/>
                </Col>
                <Col>
                    <input type='text' className='form-control' placeholder='Enter Age' value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                </Col>
                <Col>
                    <input type='checkbox' checked={editIsActive === 1 ? true : false } onChange={(e) => handleEditActiveChange(e)} value={editIsActive}/>
                    <label>isActive</label>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUpdate()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default CRUD