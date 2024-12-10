import { useState } from 'react';
import './card.css';
import InputText from '../InputText';
import InputTextArea from '../InputTextArea';
import InputScrollWheel from '../InputScrollWheel';
import { navigate } from 'astro:transitions/client';
import { useStore } from '@nanostores/react';
import { addFormItem, formItems } from '../../store/form';
import { setGTMEvent } from '../../utils/helpers';

const Card = (props) => {
	const { image, name, label, onClick, active, type, frame, form, id, disabled, metrics, login = false } = props;
  const decades = ["1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  const $formItems = useStore(formItems);

  const [showFrontCard, setShowFrontCard] = useState(!active);
  const [formData, setFormData] = useState($formItems[id] || {});

	const [initialWheelData, setInitialWheelData] = useState({
		pickerOpen: false,
		data: decades,
		defaultSelection: 1,
		selection: "2000s",
	})

  function redirect(query, formData = {}) {
    const {subtag} = metrics;
    const subtagCustom = subtag ? subtag : !formData ? query : JSON.stringify(formData)
    .replaceAll('"', "")
    .replace("{", "")
    .replace("}", "")
    .replaceAll(":", " -> ")
    .replace(',', ' + ')
    .replace("thoughts", "Search query")
    setGTMEvent({ ...metrics, subtag: subtagCustom })
    const parsedQuery = btoa(query);
    const isLogin = login? btoa('hasLogin') : btoa('');

    navigate(`/results/#${parsedQuery}`);
  }

  async function handleCard(id) {
    if (type === "custom") {
      setShowFrontCard(false);
      onClick(id);
      return;
    };
    redirect(name);
  }

  async function handleForm() {
    setShowFrontCard(true);
    const values = Object.values(formData);
    addFormItem({ name: id, ...formData });
    let localName;
    if (Object.keys(formData).includes('decade')) {
      localName = values.reverse().join(' ');
      redirect(localName, formData);
      return;
    }
    localName = values.join(' ');
    redirect(localName, formData);
  }

  function handleFormInput(value, name) {
    setFormData({...formData, [name]: value});
  }

  function handleBack() {
    setShowFrontCard(true);
    onClick(null);
  }

  return (
    <div className={`cmp-card-container ${type || ''}`.trim()}>
      { showFrontCard &&
        <div className={`cmp-card cmp-card-front${ type && disabled ? ' disabled' : ''}`}
          onClick={() =>  handleCard(id)}>
          {image && <img className="cmp-card__image" src={image} />}
          <div className="cmp-card__content">
            <img className="cmp-card__frame"
              src={frame} />
            <div className="cmp-card__text">
              <p>{ label }</p>
              <h2>{ name }</h2>
            </div>
          </div>
        </div>
      }
      { !showFrontCard && (
        <div className={`cmp-card cmp-card-front`}>
          {image && <img className="cmp-card__image" src={image} />}
          <div className="cmp-card__content">
            <img className="cmp-card__frame"
              src={frame} />
            { form && 
              <div className="cmp-card__form">
                <img className='cmp-card__icon-back'
                     onClick={() => handleBack()}
                  src='/img/icons/flip-backward-dark.svg' 
                   />
                {form.map((input, index) => {
                  switch (input.type) {
                    case "text":
                      return <InputText
                      key={index}
                      onChange={handleFormInput}
                      initialValue={formData[input.name] || ''}
                      {...input} />
                    case "textarea":
                      return <InputTextArea
                      key={index}
                      onChange={handleFormInput}
                      initialValue={formData[input.name] || ''}
                      {...input} />
                    case "wheel-picker":
                      return <InputScrollWheel
                        animation="flat"
                        data={decades}
                        height={32}
                        parentHeight={84}
                        fontSize={18}
                        defaultSelection={initialWheelData.defaultSelection}
                        // updateSelection={selectedIndex => setInitialWheelData({ selection: initialWheelData?.data[selectedIndex], defaultSelection: selectedIndex })}
                        updateSelection={selectedIndex => handleFormInput(initialWheelData?.data[selectedIndex], 'decade')}
                        scrollerId="scroll-select-subject"
                      />
                  }})}
                <button className='cmp-card__button-submit'
                  onClick={() => handleForm()}
                  >Discover
                </button>
              </div>
            }
          </div>
        </div>
      )}
    </div>
	)
}

export default Card;
