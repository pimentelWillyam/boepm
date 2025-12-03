import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  padding: 24px;
`

export const styles = StyleSheet.create({
  header: {
    width: '100%',
    top: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 22,
  },
  dados: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Ubuntu-Bold',
    color: '#777',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  botaoCriar: {
    width: 306,
    height: 100,
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tituloBotao: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
  },
  descricaoBotao: {
    fontFamily: 'Ubuntu-Bold',
    marginTop: 5,
    color: '#bbb',
  },
  iconePlus: {
    color: '#ae1ffa',
    backgroundColor: '#fff',
  },

  cardOcorrencia: {
    width: 306,
    height: 100,
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numOcorrencia: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
  },
  descricaoOcorrencia: {
    fontFamily: 'Ubuntu-Bold',
    marginTop: 5,
    color: '#bbb',
  },
})
