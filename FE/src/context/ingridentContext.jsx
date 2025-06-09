import { createContext,useEffect,useState} from "react";
import axios from "axios";
import getStatus from "../utilitys/dateCalculation";

export const IngredientContext=createContext()

export default function IngredientProvider({children}){
     const [ allIngredients, setIngredients] = useState([]);
     const [form, setForm] = useState({
    name: '', stock: '', unit:'', threshold: '', inwardDate: '', expiryDate: '',status:''
  });
  const [editId, setEditId] = useState(null);
  const [currentStatus,setCurrentStatus]=useState(null);
  const units = ['kg', 'liter', 'pieces'];
 

 const fetchIngredients = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/Ingredients-itemslist`);
    const updatedData = res.data.map(ing => {
      let stock = ing.stock;
      let threshold = ing.threshold;
      let unit = ing.unit;
      

      if (unit === "gram") {
        stock = stock / 1000;
        threshold = threshold / 1000;
        unit = "kg";
      } else if (unit === "ml") {
        stock = stock / 1000;
        threshold = threshold / 1000;
        unit = "liter";
      }
      
      return { ...ing, stock, threshold, unit };
    });
    setIngredients(updatedData);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if(e.target.name==="expiryDate")
        {
    setCurrentStatus(getStatus(e.target.value))
        }
  };


const handleSubmit = async e => {
    e.preventDefault();
  
    
    let stock = Number(form.stock);
    let threshold = Number(form.threshold);
    let unit = form.unit;

    if (unit === "kg") {
      stock = stock * 1000;
      threshold = threshold * 1000;
      unit = "gram";
    } else if (unit === "liter") {
      stock = stock * 1000;
      threshold = threshold * 1000;
      unit = "ml";
    }

    const payload = {
      ...form,
      stock,
      threshold,
      inwardDate: new Date(form.inwardDate),
      expiryDate: new Date(form.expiryDate),
      status:currentStatus.label,
      unit
    };

    if (editId) {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/edit/Ingredients/${editId}`, payload);
    } else {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/Ingredients-items`, payload);
    }
    setForm({ name: '', stock: '', unit: '', threshold: '', inwardDate: '', expiryDate: '' });
    setEditId(null);
    fetchIngredients();
  };

  const handleEdit = ing => {
    setForm({
      name: ing.name,
      stock: ing.stock,
      unit: ing.unit,
      threshold: ing.threshold,
      inwardDate: new Date(ing.inwardDate).toISOString().slice(0,16),
      expiryDate: new Date(ing.expiryDate).toISOString().slice(0,10)
    });
    setEditId(ing._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/delete/Ingredients/${id}`);
      fetchIngredients();
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: '', stock: '', unit: '', threshold: '', inwardDate: '', expiryDate: '' });
    setEditId(null);
  };


return(<>
    <IngredientContext.Provider value={{
        editId,
        form,
        handleDelete,
        handleSubmit,
        handleCancelEdit,
        handleEdit,
        allIngredients,
        fetchIngredients,
        handleChange,
        units
        }}>
        ({children})
    </IngredientContext.Provider>
</>)


}
