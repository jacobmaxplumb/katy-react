import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import * as yup from "yup";

const animalMap = {
	1: "cat",
	2: "dog",
	3: "bird"
}

const initialFormState = {
	name: "",
	age: 0,
	phone: "",
	animals: []
}

const initialErrors = {
	name: "",
	age: "",
	phone: "",
}

const schema  = yup.object().shape({
	name: yup.string().required("Name is required"),
	age: yup.number().required("Age is required").positive().integer(),
	phone: yup.string().required("Phone is required").matches(/^[0-9]+$/, "Phone must be a number"),
});

function App() {
	const [formValues, setFormValues] = useState(initialFormState);
	const [disabled, setDisabled] = useState(true);
	const [errors, setErrors] = useState(initialErrors);

	useEffect(() => {
		schema.isValid(formValues).then((valid) => {
			setDisabled(!valid);
		})
	}, [formValues]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") {
			if (checked) {
				const copyAnimals = [...formValues.animals];
				copyAnimals.push(value);
				setFormValues({...formValues, animals: copyAnimals})
			} else {
				const updatedAnimals = formValues.animals.filter((animal) => animal !== value);
				setFormValues({...formValues, animals: updatedAnimals})
			}
		} else {
			setFormValues({...formValues, [name]: value})
		}

		if (type !== "checkbox") {
			yup.reach(schema, name).validate(value)
				.then(() => {setErrors({...errors, [name]: ""})})
				.catch((err) => {setErrors({...errors, [name]: err.errors[0]})})
		}
		
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formValues);
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label for="name">Name:</label>
				<input onChange={handleChange}  name="name" value={formValues.name} />
				{errors.name && <p>{errors.name}</p>}

				<label for="age">Age:</label>
				<input onChange={handleChange} type="number" name="age" value={formValues.age} />
				{errors.age && <p>{errors.age}</p>}

				<label for="phone">Phone Number:</label>
				<input
					type="tel"
					name="phone"
					value={formValues.phone}
					onChange={handleChange}
				/>
				{errors.phone && <p>{errors.phone}</p>}

				<p>Select your pets:</p>

				{Object.keys(animalMap).map((key) => (<span key={key}>
					<input onChange={handleChange} checked={formValues.animals.includes(key)} type="checkbox" name={animalMap[key]} value={key} />
					<label for={animalMap[key]}>{animalMap[key]}</label>
				</span>))}

				<button disabled={disabled}>Submit</button>
			</form>
		</>
	);
}

export default App;
