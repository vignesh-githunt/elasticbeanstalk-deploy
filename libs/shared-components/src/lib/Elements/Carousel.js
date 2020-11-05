import React, { useState, useRef } from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const items = [
  {
    src: 'img/bg4.jpg',
    altText: 'Slide 1',
    caption: 'Slide 1'
  },
  {
    src: 'img/bg7.jpg',
    altText: 'Slide 2',
    caption: 'Slide 2'
  },
  {
    src: 'img/bg8.jpg',
    altText: 'Slide 3',
    caption: 'Slide 3'
  }
];

const BsCarousel = (props) => {
    const [activeIndex,setActiveIndex] = useState(0);
    const animating = useRef();
    const onExiting=()=> {
        animating.current = true;
      }
    
      const onExited=()=> {
        animating.current = false;
      }
    
      const next=() => {
        if (animating.current) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
      }

      const previous=()=> {
        if (animating.current) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
      }

      const goToIndex=(newIndex)=> {
        if (animating) return;
        setActiveIndex(newIndex);
      }

      const slides = items.map((item, i) => {
        return (
          <CarouselItem
            onExiting={onExiting}
            onExited={onExited}
            key={i}
          >
            <img width={ 1920 } height={ 600 } src={item.src} alt={item.altText} />
            <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
          </CarouselItem>
        );
      });

      return (
        <ContentWrapper>
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        </ContentWrapper>
    );

}


export default BsCarousel;