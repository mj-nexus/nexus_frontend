export const GrayButton = (props) => {
    const lable = props.lable;
    return (
        <button
            onClick={() => props.toggle()}
            style={{
                border: '1px solid #EFEFEF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '5px',
                padding: '8px 16px',
                backgroundColor: '#f8f9fa',
            }}
            onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#E5E5E5';
                e.currentTarget.style.border = '1px solid #E0E0E0';
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.border = '1px solid #EFEFEF';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.border = '1px solid #EFEFEF';
            }}
        >
            {lable}
        </button>
    )
}