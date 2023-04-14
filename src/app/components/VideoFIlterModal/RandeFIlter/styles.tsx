import styled from '@emotion/styled';

export const BarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const Bar = styled.div`
  display: inline-block;
  flex: 1 1 0%;
  margin-right: 2px;
`;

export const RangeControl = styled.div`
  height: 1px;
  background-color: #c7c7c7;
  position: relative;

  & input[type='range'] {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    overflow: visible;
    position: absolute;
    pointer-events: none;
    -webkit-appearance: none;
    z-index: 2;
    height: 1px;
    width: calc(100% + 20px);
    left: -10px;
    opacity: 0;

    &:active {
      &.input-left ~ .slider .thumb.left {
        transition: -ms-transform 0.2s ease 0s, -webkit-transform 0.2s ease 0s, transform 0.2s ease 0s;
        transform: scale(1.4);
      }
      &.input-right ~ .slider .thumb.right {
        transition: -ms-transform 0.2s ease 0s, -webkit-transform 0.2s ease 0s, transform 0.2s ease 0s;
        transform: scale(1.4);
      }
    }
  }

  input[type='range']::-webkit-slider-thumb {
    /* 겹쳐진 두 thumb를 모두 활성화 */
    pointer-events: all;
    width: 30px;
    height: 30px;
    border-radius: 0;
    border: 0 none;
    background-color: red;
    cursor: pointer;
    /* appearance를 해야 위의 스타일들을 볼 수 있음 */
    -webkit-appearance: none;
  }
`;

export const Slider = styled.div`
  position: relative;
  z-index: 1;
  height: 1px;
`;

export const Track = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const Range = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const Thumb = styled.div`
  position: absolute;
  z-index: 3;
  width: 20px;
  height: 20px;
  border: 0.5px solid #8c8c8c;
  background-color: #f5f5f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -10px;

  & span {
    width: 1px;
    height: 40%;
    background-color: #8c8c8c;
    margin: 0 1.5px;
  }
`;

export const ThumbLeft = styled(Thumb)`
  left: 0;
  margin-left: -10px;
`;

export const ThumbRight = styled(Thumb)`
  right: 0;
  margin-right: -10px;
`;
