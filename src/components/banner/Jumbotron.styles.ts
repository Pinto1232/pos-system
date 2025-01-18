export const styles = {
    jumbotron: {
      position: 'relative',
      width: '100%',
      height: '670px',
      overflow: 'hidden',
      margin: 0,
    },
    imageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      objectFit: 'cover', 
      objectPosition: 'center', 
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#fff',
      zIndex: 2,
      marginTop: '8%',
      '@media (max-width: 600px)': {
        marginTop: '5%',
        padding: '0 10px',
      },
      '@media (max-width: 960px)': {
        marginTop: '6%',
        padding: '0 20px',
      },
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'center',
      textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
      width: '980px',
      fontSize: '30px',
      marginTop: '5%',
      '@media (max-width: 960px)': {
        fontSize: '26px',
        width: '80%',
      },
      '@media (max-width: 600px)': {
        fontSize: '24px',
        marginTop: '40px',
        width: '90%',
      },
      '@media (max-width: 480px)': {
        fontSize: '20px',
        marginTop: '30px',
        width: '95%',
      },
    },
    subtitle: {
      textAlign: 'center',
      textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
      fontSize: '20px',
      '@media (max-width: 960px)': {
        fontSize: '18px',
      },
      '@media (max-width: 600px)': {
        fontSize: '16px',
        display: 'none',
      },
      '@media (max-width: 480px)': {
        fontSize: '14px',
      },
    },
  };