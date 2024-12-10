import Swal from 'sweetalert2'
import pdfMake from 'pdfmake/build/pdfmake'
import * as XLSX from 'xlsx'
//import pdfFonts from 'pdfmake/build/vfs_fonts';

//validaciones de formularios

export const validateEmail = (email, institutional) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@uniempresarial\.edu\.co$/

  if (email === '') {
    return { message: institutional, isEmpty: false }
  } else {
    if (!emailRegex.test(email)) {
      return { message: institutional, isEmpty: true }
    }
  }

  return ''
}

export const showPassword = (inputId) => {
  const passwordInput = document.getElementById(inputId)
  const iconSpan = document.querySelector(`#${inputId} + .btn .icon`)

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text'
    iconSpan.classList.remove('fa-eye-slash')
    iconSpan.classList.add('fa-eye')

    // Cambiar de vuelta a tipo de entrada de contraseña después de 2 segundos
    setTimeout(() => {
      passwordInput.type = 'password'
      iconSpan.classList.remove('fa-eye')
      iconSpan.classList.add('fa-eye-slash')
    }, 2000) // Cambia este valor si deseas que el tiempo sea diferente
  } else {
    passwordInput.type = 'password'
    iconSpan.classList.remove('fa-eye')
    iconSpan.classList.add('fa-eye-slash')
  }
}

export function validateName(name, messageInvalided) {
  let mensaje = ''
  const nameRegex = /^[a-zA-ZÁÉÍÓÚÜáéíóúüÑñ0-9\s]{5,100}$/
 
  if (!nameRegex.test(name.trim())) {
    mensaje = messageInvalided
    return mensaje
  }
  return ''
}

export function validateNameProf(name, messageInvalided) {
  let mensaje = ''
  const nameRegex = /^[a-zA-ZÁÉÍÓÚÜáéíóúüÑñ\s]{3,100}$/
  if (!nameRegex.test(name.trim())) {
    mensaje = messageInvalided
    return mensaje
  }
  return ''
}

export function validateNameSer(name,  messageInvalided) {
  let mensaje = ''
  const nameRegex = /^[a-zA-ZÁÉÍÓÚÜáéíóúüÑñ0-9:¿?¡!\s]{5,100}$/
  
  if (!nameRegex.test(name.trim())) {
    mensaje = messageInvalided
    return mensaje
  }
  return ''
}

export const validateNewPassword = (password, invalidFormat) => {
  let mensaje = ''
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$.!%*?&_-])[A-Za-z\d$@.$!%*?&_-]{8,15}/

  if (password === '') {
    mensaje = ''
  } else {
    if (!passwordRegex.test(password)) {
      mensaje = invalidFormat
    }
    return mensaje
  }
}

export const validateSame = (newPassword, confirmPassword, notSame, Same) => {
  let mensaje = ''

  if (confirmPassword === '') {
    return { message: '', isValid: '' }
  } else {
    if (newPassword === confirmPassword) {
      return { message: Same, isValid: true }
    } else if (newPassword !== confirmPassword) {
      return { message: notSame, isValid: false }
    }
    return mensaje
  }
}
export function validateDate(dateString, message) {
  const [year, month, day] = dateString.split('-').map(Number)
  // Meses en JavaScript van de 0 a 11, por eso restamos 1 al mes
  const input = new Date(year, month - 1, day)
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // Establecer hora, minuto, segundo y milisegundo a 0
  const inputDate = input

  if (inputDate < currentDate) {
    return message
  }

  return ''
}
export function validateTime(startTime, endTime, messageHourL, messageHourIqual) {
  let mensaje = ''
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (start > end) {
    mensaje = messageHourL
    return mensaje
    //'La hora de inicio no puede ser mayor que la hora de fin.';
  }
  if (start.getTime() === end.getTime()) {
    mensaje = messageHourIqual
    return mensaje
  }
  return ''
}
export function validateFields(fields, messageReuired) {
  const errors = {}

  for (let field of fields) {
    if (!field.value) {
      errors[field.name] = messageReuired
    }
  }
  return errors
}
export function validateStartTime(selectedDate, startTime, message) {
  const currentDate = new Date()
  // Verificar si la fecha seleccionada es hoy
  if (selectedDate.toDateString() === currentDate.toDateString()) {
    // Verificar si res_start es menor que la hora actual
    if (startTime < currentDate) {
      return message
    }
  }
  return ''
}

export const formatDocument = (document) => {
  // Verificar si el documento existe y tiene al menos 4 caracteres
  if (document && document.length >= 4) {
    // Insertar un punto después de cada grupo de 3 caracteres, comenzando desde el final
    return document.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  } else {
    return document // Devolver el documento sin cambios si no cumple con los requisitos
  }
}

//Funciones de errores

//Funcion que se usa en el catch de las funciones de los store
export const handleError = (error, confirmButtonColor = '#dd0034') => {
  if (error.response) {
    
  
    // Error de respuesta (por ejemplo, error HTTP)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `${error.response.status} - ${error.response.data.message}`,
      confirmButtonColor: confirmButtonColor
      
    })
    // console.error('Error de respuesta:', error.response.data)
  }
  if (error.request) {
    // Error de solicitud (por ejemplo, problema de red)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: ` ${error.response.data.message}`,
      confirmButtonColor: confirmButtonColor
    
    })
    // console.error('Error de solicitud:', error.response.data)
  } else {
    // Otros tipos de errores
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error: Se produjo un error inesperado',
      confirmButtonColor: confirmButtonColor
    })
    // console.error('Error inesperado:', error.message)
  }
}

//Funcion que se usa en los stores
export const handleResponse = (res, name, successMessage, duplicateAlert, invalidFormat, Iqual) => {
  if (res.data && res.data.status === false && res.data.message) {
    let messageToShow = res.data.message[0]

    let password = res.data.message
    
    //let messageToShows = res.data.message;

    if (
      password.includes('Password does not match') ||
      password.includes('The old password does not match')
    ) {
      messageToShow = invalidFormat
      showSwalAlert(name, messageToShow, 'error')
    }
    if (password.includes('New password cannot be the same as the old password')) {
      messageToShow = Iqual
      showSwalAlert(name, messageToShow, 'error')
    }
    if (messageToShow.includes('name has already been taken')) {
      messageToShow = duplicateAlert
      showSwalAlert(name, messageToShow, 'error')
    } else if (messageToShow.includes('format invalidate')) {
      messageToShow = invalidFormat
      showSwalAlert(null, messageToShow, 'error')
    } else if (
      messageToShow.includes('No users registered') ||
      messageToShow.includes('Access denied')
    ) {
      messageToShow = invalidFormat
      showSwalAlert(null, messageToShow, 'error')
    }
  }
  if (res.data && res.data.status === true) {
    let messageToShow = successMessage
    showSwalAlert(name, messageToShow, 'success')
  }
}
//Funcion que se muestra la alerta con los datos de las demas funciones
export const showSwalAlert = (
  title,
  message,
  icon = 'error',
  confirmButtonColor = '#dd0034',
  cancelButtonColor = '#d33'
) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
    confirmButtonColor: confirmButtonColor,
    cancelButtonColor: cancelButtonColor,
    confirmButtonText: 'OK'
  })
}
export const showCSVImportAlerts = (errors) => {
  if (errors && errors.length > 0) {
    // Unir los errores con salto de línea
    const errorMessages = errors.join('\n');
    
    // Mostrar errores usando SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Errores encontrados',
      text: errorMessages,
      confirmButtonText: 'Aceptar'
    });
  } else {
    // Si no hay errores, mostrar un mensaje genérico de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al procesar el archivo CSV. Por favor, inténtalo nuevamente.',
      confirmButtonText: 'Aceptar'
    });
  }
};


//Funcion de darle estilos a los botones
export const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

//Funciones de PDF Y EXCEL
export const exportToPDF = (title, data) => {
  // if (data.length === 0) {
  //   // Mostrar una alerta si el array de datos está vacío
  //   showSwalAlert(null, 'No hay datos para poder exportarlos', 'warning');
  //   return; // Salir de la función porque no hay datos para exportar
  // }

  // Obtener los nombres de las columnas del primer objeto de datos
  const pdfTable = document.getElementById('table')
  const columnNames = []
  pdfTable.querySelectorAll('th').forEach((headerCell) => {
    // Excluir el último encabezado de columna
    if (headerCell.cellIndex !== pdfTable.rows[0].cells.length - 1) {
      columnNames.push({ text: headerCell.textContent.trim(), style: 'tableHeader' })
    }
  })

  // Obtener los datos de las filas
  const rowData = data.map((row) => {
    // Obtener solo los valores de las celdas excluyendo el último
    const values = Object.values(row)

    // Verificar si alguna columna incluye la palabra 'status' y actualizar el valor correspondiente
    const columnIndex = columnNames.findIndex(
      (column) =>
        column.text.toLowerCase().includes('estado') ||
        column.text.toLowerCase().includes('state') ||
        column.text.toLowerCase().includes('status')
    )
    if (columnIndex !== -1) {
      const statusValue = values[columnIndex]
      // Actualizar el valor de la columna que contiene 'status' según sea necesario
      values[columnIndex] = statusValue === 1 ? 'Activo' : 'Inactivo'
    }

    return values
  })

  // Crear el contenido del documento PDF con la tabla y el título
  const documentDefinition = {
    content: [
      {
        text: title,
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: Array(columnNames.length).fill('auto'),
          body: [columnNames, ...rowData]
        }
      }
    ],
    styles: {
      tableHeader: {
        bold: true,
        fillColor: '#0e1f87',
        color: 'white',
        alignment: 'center'
      },
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    },
    pageSize:
      columnNames.length > 5
        ? {
            width: 792,
            height: 612,
            orientation: 'landscape'
          }
        : {
            width: 612,
            height: 792,
            orientation: 'portrait'
          }
  }

  // Generar el documento PDF
  pdfMake.createPdf(documentDefinition).open()
}

export const exportReservationToPDF = (title, data) => {
  // Obtener los nombres de las columnas del primer objeto de datos
  const columnNames = Object.keys(data[0]).map((column) => ({ text: column, style: 'tableHeader' }))

  // Obtener los datos de las filas
  const rowData = data.map((row) => {
    // Obtener solo los valores de las celdas excluyendo el último
    const values = Object.values(row)

    // Verificar si la columna es 'res_status' y actualizar el valor correspondiente
    const columnIndex = columnNames.findIndex(
      (column) =>
        column.text === 'res_status' || column.text === 'Estado' || column.text === 'ser_status'
    )
    if (columnIndex !== -1) {
      const resStatusValue = values[columnIndex]
      // Actualizar el valor de 'res_status' según sea necesario
      values[columnIndex] = resStatusValue === 1 ? 'Activa' : 'Cancelada'
    }

    return values
  })
  // Crear el contenido del documento PDF con la tabla y el título
  const documentDefinition = {
    content: [
      {
        text: title,
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: Array(columnNames.length).fill('auto'),
          body: [columnNames, ...rowData]
        }
      }
    ],
    styles: {
      tableHeader: {
        bold: true,
        fillColor: '#0e1f87',
        color: 'white',
        alignment: 'center'
      },
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    },
    pageSize:
      columnNames.length > 5
        ? {
            width: 792,
            height: 612,
            orientation: 'landscape'
          }
        : {
            width: 612,
            height: 792,
            orientation: 'portrait'
          }
  }

  // Generar el documento PDF
  pdfMake.createPdf(documentDefinition).open()
}

export const exportToCSV = (title, data) => {
  if (data.length === 0) {
    // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, 'No hay datos para poder exportarlos', 'warning')
    return // Salir de la función porque no hay datos para exportar
  }

  const wb = XLSX.utils.book_new()
  const excelTable = document.getElementById('table')

  // Extract column names dynamically from the first item in the data array
  const columnNames = []
  excelTable.querySelectorAll('th').forEach((headerCell) => {
    if (headerCell.cellIndex !== excelTable.rows[0].cells.length - 1) {
      // Agregar estilo 'tableHeader' a las columnas
      const headerText = headerCell.textContent.trim()
      const column = { text: headerText, style: 'tableHeader' }
      columnNames.push(column)
    }
  })

  // Map each item in the data array to an array of corresponding values
  const excelData = data.map((row) => Object.values(row))

  // Find the index of the "Estado" column
  const estadoIndex = columnNames.findIndex((col) => col.text === 'Estado' || col.text === 'Status' )

  // Replace the values in the "Estado" column
  excelData.forEach((row) => {
    if (estadoIndex !== -1) {
      if (row[estadoIndex] === 0) {
        row[estadoIndex] = 'Inactivo'
      } else if (row[estadoIndex] === 1) {
        row[estadoIndex] = 'Activo'
      }
    }
  })

  // Insert column names as the first element in the data array
  excelData.unshift(columnNames.map((col) => col.text))

  // Convert the data to Excel sheet format
  const ws = XLSX.utils.aoa_to_sheet(excelData)

  // Append the sheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // Write the workbook to an Excel file
  XLSX.writeFile(wb, `${title}.xlsx`)
}

export const exportReservationToCSV = (title, data) => {
  const wb = XLSX.utils.book_new()
  const excelTable = document.getElementById('table')

  // Extract column names dynamically from the first item in the data array
  const columnNames = []
  excelTable.querySelectorAll('th').forEach((headerCell) => {
    if (headerCell.cellIndex !== excelTable.rows[0].cells.length) {
      // Agregar estilo 'tableHeader' a las columnas
      const headerText = headerCell.textContent.trim()
      const column = { text: headerText, style: 'tableHeader' }
      columnNames.push(column)
    }
  })

  // Map each item in the data array to an array of corresponding values
  const excelData = data.map((row) => Object.values(row))

  // Find the index of the "Estado" column
  const estadoIndex = columnNames.findIndex((col) => col.text === 'Estado')

  // Replace the values in the "Estado" column
  excelData.forEach((row) => {
    if (estadoIndex !== -1) {
      if (row[estadoIndex] === 0) {
        row[estadoIndex] = 'Inactivo'
      } else if (row[estadoIndex] === 1) {
        row[estadoIndex] = 'Activo'
      }
    }
  })

  // Insert column names as the first element in the data array
  excelData.unshift(columnNames.map((col) => col.text))

  // Convert the data to Excel sheet format
  const ws = XLSX.utils.aoa_to_sheet(excelData)

  // Append the sheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // Write the workbook to an Excel file
  XLSX.writeFile(wb, `${title}.xlsx`)
}
