import React from 'react'

const Pizzerias = ({pizzerias}) => {
  return (
    <div>
      {pizzerias.map((pizzeria) => (
        <div className="pizzeriaWrapper">
          <div className="name">{pizzeria.name}</div>
        </div>
      ))}
    </div>
  )
}

export default Pizzerias;
