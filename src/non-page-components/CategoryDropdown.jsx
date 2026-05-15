import { useState, useEffect } from "react"
import { supabase } from "./supabaseDB"

export default function CategoryDropdown({ value, onChange }) {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCategories() {
            const { data, error } = await supabase
                .from('Category')
                .select('*')


            if (error) {
                console.error('Error fetching categories:', error)
            } else {
                setCategories(data)
            }
            setLoading(false)
        }
        fetchCategories()
    }, [])

    return (
        <label htmlFor="categoryID">
            <h2 className="font-bold text-inherit pb-2">Category</h2>
            <select
                id="categoryID"
                name="categoryID"
                value={value}
                onChange={onChange}
                disabled={loading}
                className="outline-2 outline-gray-300 p-3 rounded-md w-full bg-white text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-primary-blue"
            >
                <option value="" disabled>
                    {loading ? "Loading categories..." : "Select a category..."}
                </option>
                {categories.map((cat) => (
                    <option key={cat.categoryID} value={cat.categoryID}>
                        {cat.categoryName}
                    </option>
                ))}
            </select>
        </label>
    )
}
