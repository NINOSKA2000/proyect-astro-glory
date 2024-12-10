import "./layout.css";
export default function Layout({children, showButton = false}) {

  return <div className="layout">
    <div className="layout__header">
      <div className="layoutHeader">
       <div className="header_info">
          <div className="layout__square"></div>
          <div className="layout__head">
            <div>
              Search Demo by{" "}
              <span>
                Sociate
              </span>
            </div>
            <div className="subtitle">
              Fashion’s Fastest-Learning AI
            </div>
         </div>
        </div>
    {showButton &&  <div className="options">
        <div className="options__item selected">
          Bubbles
        </div>
          <a href="/cards-private" className="options__item">
          Cards
        </a>
      </div>}
      </div>
    </div>
    <div className="layout__container">
      <div className="layout__body">
            {children}
      </div>
    </div>
  </div>;
}
